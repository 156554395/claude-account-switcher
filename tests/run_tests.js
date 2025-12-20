// 测试运行器
// 用于运行所有单元测试

import { runTests as runModelConfigTests } from './unit/model_config.test.js';

async function runAllTests() {
  console.log('开始运行测试套件...\n');

  try {
    // 运行模型配置测试
    await runModelConfigTests();

    console.log('\n✅ 所有测试完成');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests };