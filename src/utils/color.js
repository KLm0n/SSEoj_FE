
// 难度对应颜色
const colorMap = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'yellow',
    5: 'orange',
    6: 'purple',
};

/**
 * 根据难度返回对应的颜色
 * @param {number} number - 1 到 6 之间的数字
 * @returns {string} - 对应的颜色
 */

export function getDifficultColor(diff) {
    return colorMap[diff] || 'red';  // 默认红色
}