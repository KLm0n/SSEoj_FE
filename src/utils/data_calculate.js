

export function transTime(t) {
    if (t == undefined)
        return NaN
    else if (t <= 1000)
        return `${t} ms`
    else
        return (t / 100).toFixed(1).toString() + ' s';
}

export function transMem(m) {
    if (m == undefined)
        return NaN
    else if (m <= 1024)
        return `${m} KB`
    else
        return (Math.round(m / 1024)).toFixed(1).toString() + ' MB'
}

export function transNum(n) {
    if (n == undefined)
        return NaN
    else if (n < 1000)
        return n.toString()
    else if (n >= 1000 && n < 1000000)
        return (n / 1000).toFixed(1).toString() + ' K'
    else
        return (n / 1000000).toFixed(1).toString + ' M'
}