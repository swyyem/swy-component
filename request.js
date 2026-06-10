/**
 * 网络请求控制器 - 支持暂停、恢复、取消功能
 * 
 * 重要说明：
 * 1. HTTP协议本身不支持"暂停"，TCP连接一旦建立就会持续传输
 * 2. 这里的"暂停"是指：暂停发起新请求，或暂停处理响应数据
 * 3. "取消"是真正中断请求（使用 AbortController）
 */

class RequestController {
  constructor() {
    // 当前请求的 AbortController
    this.currentController = null;
    // 请求状态：idle(空闲) | loading(进行中) | paused(已暂停) | cancelled(已取消)
    this.state = 'idle';
    // 暂停时的 Promise 解析器
    this.resumeResolver = null;
    // 暂停时的 Promise
    this.pausePromise = null;
    // 请求ID，用于竞态控制
    this.requestId = 0;
    // 配置项
    this.config = {
      timeout: 30000, // 默认超时时间 30s
      retryCount: 0,  // 重试次数
      retryDelay: 1000 // 重试延迟 1s
    };
  }

  /**
   * 发起网络请求（支持暂停、恢复、取消）
   * @param {string} url - 请求地址
   * @param {Object} options - 请求配置
   * @returns {Promise<Object>} 请求结果
   */
  async fetch(url, options = {}) {
    // 每次请求生成唯一ID
    const currentRequestId = ++this.requestId;
    
    // 如果之前有请求，先取消
    if (this.currentController) {
      this.abort();
    }

    // 创建新的 AbortController
    this.currentController = new AbortController();
    const signal = this.currentController.signal;

    // 合并配置
    const fetchOptions = {
      ...options,
      signal, // 注入取消信号
    };

    // 设置状态为加载中
    this.state = 'loading';

    try {
      // 检查是否处于暂停状态
      await this._checkPaused();

      // 如果检查期间请求被取消了，直接返回
      if (this.state === 'cancelled' || this.requestId !== currentRequestId) {
        return this._createResponse(null, 'cancelled');
      }

      // 设置超时控制
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('请求超时'));
          this.currentController?.abort();
        }, options.timeout || this.config.timeout);
      });

      // 发起实际请求，与超时竞争
      const fetchPromise = fetch(url, fetchOptions);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // 再次检查是否被暂停或取消
      await this._checkPaused();
      if (this.state === 'cancelled' || this.requestId !== currentRequestId) {
        return this._createResponse(null, 'cancelled');
      }

      // 解析响应数据
      const data = await response.json();

      // 最终检查
      await this._checkPaused();
      if (this.requestId !== currentRequestId) {
        return this._createResponse(null, 'cancelled');
      }

      // 请求成功完成
      this.state = 'idle';
      return this._createResponse(data, 'success');

    } catch (error) {
      // 处理取消请求的情况
      if (error.name === 'AbortError') {
        return this._createResponse(null, 'cancelled');
      }

      // 处理超时
      if (error.message === '请求超时') {
        this.state = 'idle';
        return this._createResponse(null, 'timeout');
      }

      // 其他错误
      console.error('请求失败:', error);
      this.state = 'idle';
      return this._createResponse(null, 'error', error);
    }
  }

  /**
   * 暂停请求
   * 注意：不是暂停已发出的HTTP请求，而是暂停后续的处理流程
   */
  pause() {
    if (this.state !== 'loading') {
      console.warn('当前没有进行中的请求，无法暂停');
      return;
    }

    this.state = 'paused';
    console.log('请求已暂停');

    // 创建一个 Promise，等待恢复时 resolve
    this.pausePromise = new Promise((resolve) => {
      this.resumeResolver = resolve;
    });
  }

  /**
   * 恢复请求
   */
  resume() {
    if (this.state !== 'paused') {
      console.warn('当前请求未处于暂停状态');
      return;
    }

    this.state = 'loading';
    console.log('请求已恢复');

    // 恢复暂停的 Promise
    if (this.resumeResolver) {
      this.resumeResolver();
      this.resumeResolver = null;
      this.pausePromise = null;
    }
  }

  /**
   * 取消请求
   * 真正中断 HTTP 请求
   */
  abort() {
    if (this.currentController) {
      this.currentController.abort();
      this.currentController = null;
    }

    this.state = 'cancelled';
    console.log('请求已取消');

    // 如果处于暂停状态，也要恢复（避免 Promise 永远 pending）
    if (this.state === 'paused' && this.resumeResolver) {
      this.resumeResolver();
    }
  }

  /**
   * 重置控制器状态
   */
  reset() {
    this.abort();
    this.state = 'idle';
    this.requestId = 0;
    this.pausePromise = null;
    this.resumeResolver = null;
  }

  /**
   * 检查是否处于暂停状态（内部方法）
   * 如果暂停了，会等待恢复后才继续
   */
  async _checkPaused() {
    if (this.state === 'paused' && this.pausePromise) {
      console.log('等待请求恢复...');
      await this.pausePromise;
    }
  }

  /**
   * 创建统一的响应格式
   */
  _createResponse(data, status, error = null) {
    return {
      data,
      status, // 'success' | 'cancelled' | 'timeout' | 'error'
      error,
      timestamp: Date.now()
    };
  }

  /**
   * 获取当前状态
   */
  getState() {
    return this.state;
  }
}

// ==================== 使用示例 ====================

// 1. 基础使用
const controller = new RequestController();

async function basicUsage() {
  const result = await controller.fetch('https://api.example.com/data', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  console.log('请求结果:', result);
  // 输出: { data: {...}, status: 'success', error: null, timestamp: 1234567890 }
}

// 2. 暂停和恢复请求
async function pauseAndResume() {
  const promise = controller.fetch('https://api.example.com/large-data');

  // 暂停请求（实际上是暂停响应处理）
  setTimeout(() => {
    controller.pause();
    console.log('暂停了请求');
  }, 100);

  // 2秒后恢复
  setTimeout(() => {
    controller.resume();
    console.log('恢复了请求');
  }, 2000);

  const result = await promise;
  console.log('最终结果:', result);
}

// 3. 取消请求
async function cancelRequest() {
  const promise = controller.fetch('https://api.example.com/data');

  // 1秒后取消请求
  setTimeout(() => {
    controller.abort();
    console.log('取消了请求');
  }, 1000);

  const result = await promise;
  console.log('结果:', result);
  // 输出: { data: null, status: 'cancelled', error: null, timestamp: ... }
}

// 4. 竞态控制（快速切换场景）
async function raceCondition() {
  // 第一次请求
  const promise1 = controller.fetch('https://api.example.com/data1');
  
  // 立即发起第二次请求（会自动取消第一次）
  const promise2 = controller.fetch('https://api.example.com/data2');

  const [result1, result2] = await Promise.all([promise1, promise2]);
  
  console.log('第一次请求结果:', result1.status); // 'cancelled'
  console.log('第二次请求结果:', result2.status); // 'success'
}

// 5. 带重试机制的请求
class RetryableRequestController extends RequestController {
  async fetchWithRetry(url, options = {}) {
    const maxRetries = options.retryCount || this.config.retryCount;
    const retryDelay = options.retryDelay || this.config.retryDelay;

    for (let i = 0; i <= maxRetries; i++) {
      const result = await this.fetch(url, options);

      if (result.status === 'success') {
        return result;
      }

      if (result.status === 'cancelled') {
        return result; // 用户取消，不重试
      }

      // 如果不是最后一次尝试，等待后重试
      if (i < maxRetries) {
        console.log(`请求失败，${retryDelay}ms 后重试 (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    return this._createResponse(null, 'error', new Error('重试次数已用完'));
  }
}

// 6. 批量请求控制
class BatchRequestController {
  constructor() {
    this.controllers = new Map();
  }

  /**
   * 添加批量请求
   */
  addRequest(key, url, options) {
    const controller = new RequestController();
    this.controllers.set(key, controller);

    const promise = controller.fetch(url, options).then(result => {
      // 请求完成后自动清理
      this.controllers.delete(key);
      return result;
    });

    return { controller, promise };
  }

  /**
   * 批量取消
   */
  cancelAll() {
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
  }

  /**
   * 批量暂停
   */
  pauseAll() {
    this.controllers.forEach(controller => controller.pause());
  }

  /**
   * 批量恢复
   */
  resumeAll() {
    this.controllers.forEach(controller => controller.resume());
  }
}

// ==================== 导出模块 ====================

// 如果使用 CommonJS
if (typeof module !== 'undefined') {
  module.exports = {
    RequestController,
    RetryableRequestController,
    BatchRequestController
  };
}

// 如果使用 ES Modules
export { RequestController, RetryableRequestController, BatchRequestController };