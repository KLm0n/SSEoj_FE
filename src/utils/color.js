
// 难度对应颜色
const colorMap = {
    1: '#C2BFC2',
    2: '#8ED9AE',
    3: '#8FCADA',
    4: '#FFB47E',
    5: '#FA6D00',
    6: '#FD0600',
};

/**
 * 根据难度返回对应的颜色
 * @param {number} number - 1 到 6 之间的数字
 * @returns {string} - 对应的颜色
 */

export function getDifficultColor(diff) {
    return colorMap[diff] || colorMap[0];  // 默认红色
}