export const getFullDate = (dateStr) => {
   console.log(dateStr)
    const date = new Date(dateStr)
    const y = date.getFullYear()
    const M = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const m = date.getMinutes()
    return `${y}-${M}-${d} ${h}:${m}`
}

export const getDate = (dateStr) => {
    const date = new Date(dateStr)
    const y = date.getFullYear()
    const M = date.getMonth() + 1
    const d = date.getDate()
    return `${y}-${M}-${d}`
}

export const getTime = (dateStr) => {
    const date = new Date(dateStr)
    const h = date.getHours()
    const m = date.getMinutes()
    return `${h}:${m}`
}

export const transformDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const delta = Math.abs(today - date)
    if (delta <= 60 * 1000)
        return '刚刚'
    else if (delta < 60 * 60 * 1000)
        return `${Math.ceil(delta / (60 * 1000))}分钟前`
    else if (delta < 24 * 60 * 60 * 1000)
        return `${Math.ceil(delta / (60 * 60 * 1000))}小时前`
    else
        return getDate(dateStr)
}

// transformTime('2024-12-30 09:17:11.098980+00:00')
// const res = transformTime('2025-1-3 10:57:15.098980+00:00')
// console.log(res)
