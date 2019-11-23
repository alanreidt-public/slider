import { sliderFactory } from "./SliderFactory";

/**
 * This object represents API for the slider.
 * All interactions with the slider must happen only through it.
 */
export const slider = {
  _factory: sliderFactory,
  _parentsMap: new WeakMap(),

  create($parent, options) {
    const sliderModel = this._factory.createModel(options);
    const sliderAdapter = this._factory.createAdapter(sliderModel);
    const sliderUi = this._factory.createUI($parent, sliderAdapter);

    const sliderUiBoundedUpdate = sliderUi.update.bind(sliderUi);
    sliderAdapter.addSubscriber("update", sliderUiBoundedUpdate);

    this._parentsMap.set($parent, {
      sliderModel,
      sliderAdapter,
      sliderUi,
    });
  },

  getOptions($parent) {
    return this._parentsMap.get($parent).sliderAdapter.getOptions();
  },

  setOptions($parent, options) {
    this._parentsMap.get($parent).sliderAdapter.update(options);
  },

};
