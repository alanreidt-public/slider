import {Slider} from "./Slider";
import {Model} from "./Model";
import {SliderUI} from "./SliderUI";

let slider = new Slider({
  value: [0, 100],
  tooltips: true,
});
let model = new Model(slider);
let sliderElement = document.querySelector(".someUserClass");
let sliderUI = new SliderUI(sliderElement, model);
