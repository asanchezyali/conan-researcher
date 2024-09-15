import asyncio
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from functools import partial

thread_executor = None
process_executor = None

def get_thread_executor():
    global thread_executor
    if thread_executor is None:
        thread_executor = ThreadPoolExecutor(max_workers=4)
    return thread_executor

def get_process_executor():
    global process_executor
    if process_executor is None:
        process_executor = ProcessPoolExecutor(max_workers=4)
    return process_executor

async def run_blocking_code_in_thread(blocking_func, *args, **kwargs):
    loop = asyncio.get_running_loop()
    executor = get_thread_executor()
    func = partial(blocking_func, *args, **kwargs)
    return await loop.run_in_executor(executor, func)

async def run_blocking_code_in_process(blocking_func, *args, **kwargs):
    loop = asyncio.get_running_loop()
    executor = get_process_executor()
    func = partial(blocking_func, *args, **kwargs)
    return await loop.run_in_executor(executor, func)

def initialize_pools():
    global thread_executor, process_executor
    thread_executor = ThreadPoolExecutor(max_workers=4)
    # process_executor = ProcessPoolExecutor(max_workers=4)
    print("Thread and Process executors initialized")

def shutdown_pools():
    global thread_executor, process_executor
    if thread_executor:
        thread_executor.shutdown(wait=True)
    if process_executor:
        process_executor.shutdown(wait=True)
    print("Thread and Process executors shut down")