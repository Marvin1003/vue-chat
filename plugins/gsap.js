import TimelineLite from "gsap/umd/TimelineLite";
import CSSPlugin from "gsap/umd/CSSPlugin";
import TextPlugin from "gsap/umd/TextPlugin";
import ScrollToPlugin from "gsap/umd/ScrollToPlugin";
import BezierPlugin from "gsap/umd/BezierPlugin";
// Temp workaround to prevent tree shaking kicking in
console.log(TimelineLite, CSSPlugin, TextPlugin, ScrollToPlugin, BezierPlugin);
console.clear();
