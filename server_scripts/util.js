/** 
 * 生成范围内随机整数（左闭右闭）
 * @param {Number} min
 * @param {Number} max
*/
function randint(max,min){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}