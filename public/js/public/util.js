/**
 * @format
 * @author lomofu
 * @desc
 * @create 11/Mar/2022 16:01
 */

const utilModule = (function () {
  const loadScript = (url, callback) => {
    const script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
      //IE
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      //Others
      script.onload = function () {
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  return {
    loadScript,
  };
})();


