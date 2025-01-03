import Mock from "mockjs";

Mock.mock(/\/api\/tags\//, 'get', () => {
    const data = [

        {
            "id": 1,
            "name": "分治",
            "parent": null
        },
        {
            "id": 2,
            "name": "动态规划",
            "parent": null
        },
        {
            "id": 3,
            "name": "贪心算法",
            "parent": null
        },
        {
            "id": 4,
            "name": "回溯",
            "parent": null
        },
        {
            "id": 5,
            "name": "图",
            "parent": null
        },
        {
            "id": 6,
            "name": "字符串",
            "parent": null
        },
        {
            "id": 7,
            "name": "最短路算法",
            "parent": null
        },
        {
            "id": 8,
            "name": "搜索",
            "parent": null
        },
        {
            "id": 9,
            "name": "树",
            "parent": null
        },
        {
            "id": 10,
            "name": "并查集",
            "parent": null
        },
        {
            "id": 11,
            "name": "归并排序",
            "parent": 1
        },
        {
            "id": 12,
            "name": "快速排序",
            "parent": 1
        },
        {
            "id": 13,
            "name": "二分查找",
            "parent": 1
        },
        {
            "id": 14,
            "name": "Strassen矩阵乘法",
            "parent": 1
        },
        {
            "id": 15,
            "name": "Karatsuba乘法",
            "parent": 1
        },
        {
            "id": 16,
            "name": "背包问题",
            "parent": 2
        },
        {
            "id": 17,
            "name": "最长递增子序列",
            "parent": 2
        },
        {
            "id": 18,
            "name": "最长公共子序列",
            "parent": 2
        },
        {
            "id": 19,
            "name": "动态规划树",
            "parent": 2
        },
        {
            "id": 20,
            "name": "区间规划",
            "parent": 2
        },

        {
            "id": 21,
            "name": "最小生成树",
            "parent": 5
        },
        {
            "id": 22,
            "name": "最大流问题",
            "parent": 5
        },
        {
            "id": 23,
            "name": "网络流",
            "parent": 5
        },
        {
            "id": 24,
            "name": "拓扑排序",
            "parent": 9
        },
        {
            "id": 25,
            "name": "深度优先搜索",
            "parent": 8
        },
        {
            "id": 26,
            "name": "广度优先搜索",
            "parent": 8
        },
        {
            "id": 27,
            "name": "Dijkstra算法",
            "parent": 7
        },
        {
            "id": 28,
            "name": "Bellman-Ford算法",
            "parent": 7
        },
        {
            "id": 29,
            "name": "Floyd-Warshall算法",
            "parent": 7
        },
        {
            "id": 30,
            "name": "KMP算法",
            "parent": 6
        },
        {
            "id": 31,
            "name": "Rabin-Karp算法",
            "parent": 6
        },
        {
            "id": 32,
            "name": "Manacher算法",
            "parent": 6
        },
        {
            "id": 33,
            "name": "A*搜索算法",
            "parent": 8
        },
        {
            "id": 34,
            "name": "模拟退火算法",
            "parent": 4
        },
        {
            "id": 35,
            "name": "遗传算法",
            "parent": 4
        }
    ]
    return {
        err: null,
        data: data
    }
})