/**
 @author lomofu
 @desc
 @create 11/Mar/2022 16:17
 */
const constantModule = (function () {
    const router = [{path: '/', name: "Home"}, {path: '/story', name: "Story"}, {path: '/about', name: "About"},]


    return {
        jq: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js', router
    }
})()