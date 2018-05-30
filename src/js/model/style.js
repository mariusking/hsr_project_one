//styleservices
const styleservices = (() => {

    function get() {
        return JSON.parse(localStorage.getItem("style")) || false;
    }

    function toggle() {
        localStorage.setItem('style', !get());
    }

    return {
        get,
        toggle
    }
})();
