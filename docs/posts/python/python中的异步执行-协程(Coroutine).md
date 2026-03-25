---
outline: deep
title: python中的异步执行协程Coroutine以及并发asyncio.gather
date: 2026-3-23
excerpt: "协程是一种可以暂停和恢复执行的函数"
---

# python中的异步执行协程 Coroutine， 并发asyncio.gather

## 什么是协程？

协程是一种**可以暂停和恢复执行的函数**。与常规函数不同：

```python
# 常规函数：执行时一直运行到结束
def normal_function():
    print("开始")
    # 一旦调用，必须执行完所有代码才能返回
    print("结束")
    return "结果"

# 协程函数：可以在执行中间暂停
async def coroutine_function():
    print("开始")
    await asyncio.sleep(1)  # ← 在这里暂停 1 秒，让出控制权
    print("继续执行")
    return "结果"
```

类似`JS`中的异步函数`async function`**(执行有区别)**

## **协程对象是什么？**

当你调用一个 `async def` 定义的函数时，**不会立即执行代码**，而是返回一个**协程对象**：

```python
async def process_item(item):
    print(f"处理 {item}")
    await asyncio.sleep(1)
    return item * 2

# 调用异步函数
coro = process_item(5)  # ← 这不执行函数！只创建协程对象

print(type(coro))  # <class 'coroutine'>
print(coro)        # <coroutine object process_item at 0x...>

# 协程对象必须被 await 或交给事件循环才会执行
result = await coro  # 现在才真正执行
```

## 与JS异步函数区别

调用`JS`中的异步函数`async function` **执行了**

```javascript
// 赋值给变量的异步函数表达式
const add = async function (x) {
	console.log('js执行了')
  const a = await Promise.resolve(10);
  const b = await Promise.resolve(20);
  return x + a + b;
};

add(1) # ← 函数执行！
```

## 列表推导式创建协程对象

```python
# 第一行：创建协程对象列表
tasks = [process_item(item) for item in batch.items]

# 等价于：
tasks = []
for item in batch.items:
    coro = process_item(item)  # 创建协程对象（不执行）
    tasks.append(coro)
```

**此时发生了什么：**

- ✅ 创建了多个协程对象（每个对应一个 `item`）
- ❌ **还没有任何实际执行**
- 📦 这些协程对象像"待执行的任务清单"

## **协程 vs Task（任务）**

在 `asyncio` 中有两个相关但不同的概念：

```python
import asyncio

async def process_item(item):
    await asyncio.sleep(1)
    return item

# 方式 1: 直接使用协程对象
coro = process_item(1)  # 协程对象
results = await asyncio.gather(coro)

# 方式 2: 包装成 Task（更高级的封装）
task = asyncio.create_task(process_item(1))  # Task 对象
result = await task

# 在你的代码中：
tasks = [process_item(item) for item in batch.items]
# gather() 会自动将协程对象包装成 Task 并调度执行
results = await asyncio.gather(*tasks)
```

**区别：**
| 特性 | 协程对象 (Coroutine) | Task 对象 |
|------|---------------------|-----------|
| 创建 | `async def()` | `asyncio.create_task()` |
| 执行时机 | 需要被 await | 立即调度到事件循环 |
| 用途 | 基础异步单元 | 并发控制、取消、监控 |
| `gather()` 处理 | 自动包装成 Task | 直接使用 |

## **完整执行流程图解**

```
┌─────────────────────────────────────────────────────┐
│ 代码：tasks = [process_item(item) for item in items] │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 创建协程对象列表（未执行）                            │
│ tasks = [coro1, coro2, coro3, ...]                   │
│         ↑      ↑      ↑                              │
│   都是 process_item 的协程对象                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ await asyncio.gather(*tasks)                         │
│ - 将所有协程包装成 Task                               │
│ - 提交到事件循环                                      │
│ - 并发调度执行                                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 事件循环并发执行所有任务                              │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│ │  Task 1  │  │  Task 2  │  │  Task 3  │           │
│ │ process  │  │ process  │  │ process  │           │
│ │   I/O    │  │   I/O    │  │   I/O    │           │
│ └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 返回所有结果                                         │
│ results = [result1, result2, result3, ...]          │
└─────────────────────────────────────────────────────┘
```

## **示例对比**

```python
import asyncio

async def process_item(item):
    print(f"开始处理：{item}")
    await asyncio.sleep(1)  # 模拟 I/O 操作
    print(f"完成处理：{item}")
    return item * 2

async def main():
    items = [1, 2, 3, 4, 5]

    # 第一步：创建协程对象
    print("=== 创建协程对象 ===")
    tasks = [process_item(item) for item in items]
    print(f"创建了 {len(tasks)} 个协程对象")
    # 此时没有任何输出，因为还没执行

    # 第二步：并发执行所有协程
    print("\n=== 开始并发执行 ===")
    results = await asyncio.gather(*tasks, return_exceptions=True)

    print(f"\n结果：{results}")

# 运行
asyncio.run(main())
```

`asyncio.gather`类似`JS`中的`Promise.all`**并发执行**

**输出：**

```
=== 创建协程对象 ===
创建了 5 个协程对象

=== 开始并发执行 ===
开始处理：1
开始处理：2
开始处理：3
开始处理：4
开始处理：5
（等待 1 秒后）
完成处理：1
完成处理：2
完成处理：3
完成处理：4
完成处理：5

结果：[2, 4, 6, 8, 10]
```

## **总结**

1. **协程对象** = 异步函数的"蓝图"或"承诺"，需要被驱动才执行
2. **创建 ≠ 执行**：调用 `async def` 函数只创建对象，不执行代码
3. **执行方式**：
   - `await coroutine` - 等待单个协程
   - `asyncio.gather(*coros)` - 并发执行多个协程
   - `asyncio.create_task(coro)` - 创建任务立即调度
4. **性能优势**：通过 `gather()` 并发执行 I/O 密集型任务，大幅提升效率

这就是为什么："**异步方式相比同步可提升n倍处理效率**"！
