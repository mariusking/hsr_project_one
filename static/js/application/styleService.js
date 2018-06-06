export default class StyleService {
    get() {
        return JSON.parse(localStorage.getItem("style")) || false;
    }
    toggle() {
        localStorage.setItem('style', !this.get());
    }
}
