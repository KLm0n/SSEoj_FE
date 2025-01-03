
const statusMap = new Map([
    [-2, ["CE", "COMPILE_ERROR", "编译错误"]],
    [-1, ["WA", "WRONG_ANSWER", "答案错误"]],
    [0, ["AC", "ACCEPTED", "答案正确"]],
    [1, ["TLE", "CPU_TIME_LIMIT_EXCEEDED", "超出时间限制"]],
    [2, ["TLE", "REAL_TIME_LIMIT_EXCEEDED", "超出时间限制"]],
    [3, ["MLE", "MEMORY_LIMIT_EXCEEDED", "超出内存限制"]],
    [4, ["RE", "RUNTIME_ERROR", "运行时错误"]],
    [5, ["SE", "SYSTEM_ERROR", "系统错误"]],
    [6, ["PD", "PENDING", "判题中"]],
    [7, ["JG", "JUDGING", "判题中"]],
    [8, ["PAC", "PARTIALLY_ACCEPTED", "部分接受"]]
]);

export const statusCodeToDesc = (code) => {
    return statusMap.get(code) || ["US", "Unknow Status", "未知状态"]
}