import { assert } from 'chai';

import { simulateMouseEvent } from '../../modules/testUtilities';
import ViewController from './ViewController';
import {
  SLIDER_NAME,
  BASE_NAME,
  HANDLE_GROUP_NAME,
  TOOLTIP_NAME,
  HANDLE_NAME,
  JS_SLIDER_SELECTOR,
  JS_BASE_SELECTOR,
  JS_HANDLE_GROUP_SELECTOR,
  JS_TOOLTIP_SELECTOR,
  HANDLE_CLASS_NAME,
  VERTICAL_FLAG_NAME,
} from '../constants';

describe('ViewController', () => {
  describe('constructor', () => {
    describe('shall paint slider structure', () => {
      const options = {
        boundaries: [0, 100],
        values: [20, 80],
        step: 1,
        isVertical: true,
        hasTooltips: true,
      };
      const model = {
        _options: options,
        getOptions() {
          return this._options;
        },
      };
      const parent = document.createElement('div');

      new ViewController(parent, model);

      context('paint static structure correctly', () => {
        it(`create ${SLIDER_NAME} element`, () => {
          const slider = parent.querySelector(JS_SLIDER_SELECTOR);

          assert.isNotNull(slider);
        });

        it(`create ${BASE_NAME} element`, () => {
          const sliderBase = parent.querySelector(JS_BASE_SELECTOR);

          assert.isNotNull(sliderBase);
        });
      });

      context('paint dynamic structure correctly', () => {
        const requiredQuantity = options.values.length;

        it(`create ${requiredQuantity} ${HANDLE_GROUP_NAME} elements`, () => {
          const handleGroups = parent.querySelectorAll(
            JS_HANDLE_GROUP_SELECTOR,
          );

          assert.equal(requiredQuantity, handleGroups.length);
        });

        it(`create ${requiredQuantity} ${TOOLTIP_NAME} elements`, () => {
          const tooltips = parent.querySelectorAll(JS_TOOLTIP_SELECTOR);

          assert.equal(requiredQuantity, tooltips.length);
        });

        it(`create ${requiredQuantity} ${HANDLE_NAME} elements`, () => {
          const handles = parent.querySelectorAll(`.${HANDLE_CLASS_NAME}`);

          assert.equal(requiredQuantity, handles.length);
        });
      });

      context(`assign correct data-index to ${HANDLE_GROUP_NAME}`, () => {
        const handleGroups = parent.querySelectorAll(JS_HANDLE_GROUP_SELECTOR);

        handleGroups.forEach((handleGroup, index) => {
          it(`#${index +
            1} ${HANDLE_GROUP_NAME}'s data-index is equal to ${index}`, () => {
            assert.equal(Number(handleGroup.dataset.index), index);
          });
        });
      });
    });
    describe(`shall add ${VERTICAL_FLAG_NAME} modifier, when needed`, () => {
      const parent = document.createElement('div');
      const options = {
        boundaries: [0, 100],
        values: [20, 80],
        step: 1,
        isVertical: true,
        hasTooltips: true,
      };
      const model = {
        _options: options,
        getOptions() {
          return this._options;
        },
      };
      it(`add ${VERTICAL_FLAG_NAME} modifier, if isVertical is true`, () => {
        new ViewController(parent, model);
        const sliderClassList = parent.querySelector(JS_SLIDER_SELECTOR)
          .classList;

        assert.isTrue(
          sliderClassList.contains(`${SLIDER_NAME}_${VERTICAL_FLAG_NAME}`),
        );
      });

      it('add nothing, if isVertical is false', () => {
        Object.assign(options, {
          isVertical: false,
        });
        new ViewController(parent, model);
        const sliderClassList = parent.querySelector(JS_SLIDER_SELECTOR)
          .classList;

        assert.isFalse(
          sliderClassList.contains(`${SLIDER_NAME}_${VERTICAL_FLAG_NAME}`),
        );
      });
    });

    describe(`shall create ${TOOLTIP_NAME} element, when needed`, () => {
      const parent = document.createElement('div');
      const options = {
        boundaries: [0, 100],
        values: [20, 80],
        step: 1,
        isVertical: true,
        hasTooltips: true,
      };
      const model = {
        _options: options,
        getOptions() {
          return this._options;
        },
      };

      it(`create ${TOOLTIP_NAME} element, if hasTooltips flag is true`, () => {
        new ViewController(parent, model);
        const sliderTooltips = parent.querySelector(JS_TOOLTIP_SELECTOR);

        assert.isNotNull(sliderTooltips);
      });

      it(`create nothing, if hasTooltips flag is false`, () => {
        Object.assign(options, {
          hasTooltips: false,
        });
        new ViewController(parent, model);
        const sliderTooltips = parent.querySelector(JS_TOOLTIP_SELECTOR);

        assert.isNull(sliderTooltips);
      });
    });

    context('shall repaint (refresh) slider structure', () => {
      const parent = document.createElement('div');
      const options = {
        boundaries: [0, 100],
        values: [20, 80],
        step: 1,
        isVertical: true,
        hasTooltips: true,
      };
      const model = {
        _options: options,
        getOptions() {
          return this._options;
        },
      };
      new ViewController(parent, model);

      const slider = parent.querySelector(JS_SLIDER_SELECTOR);

      it('slider and repainted slider (with the same values) are not equal', () => {
        new ViewController(parent, model);

        const newSlider = parent.querySelector(JS_SLIDER_SELECTOR);

        assert.notEqual(slider, newSlider);
      });
    });

    describe('shall handle user actions (Controller)', () => {
      const parent = document.createElement('div');
      document.body.append(parent);

      describe('shall listen to events on base element', () => {
        context('trigger model setOptions method on mousedown event', () => {
          const mousePositionValues = [20, 100, 200];
          const expectationValues = [10, 50, 100];

          mousePositionValues.forEach((mousePositionValue, i) => {
            const options = {
              boundaries: [0, 100],
              values: [20, 80],
              step: 1,
              isVertical: false,
              hasTooltips: true,
            };
            const model = {
              _options: options,
              isTriggered: false,

              getOptions() {
                return this._options;
              },

              setOptions(newOptions) {
                this.isTriggered = true;
                this._options = {
                  ...options,
                  ...newOptions,
                };
              },
            };

            new ViewController(parent, model);

            const base = parent.querySelector(JS_BASE_SELECTOR);

            base.style.width = '200px';

            const expectationValue = expectationValues[i];

            simulateMouseEvent('mousedown', base, {
              clientX: mousePositionValue,
            });
            simulateMouseEvent('mouseup', base);

            it(`model setOptions is triggered on mouse event ${i + 1}`, () => {
              assert.isTrue(model.isTriggered);
            });

            it(`passed value = ${expectationValue} on mouse position = ${mousePositionValue}`, () => {
              assert.deepEqual(expectationValue, model._options.values);
            });
          });
        });

        context(
          `trigger model setOptions method on mousedown event,
        when slider is vertical`,
          () => {
            const mousePositionValues = [20, 100, 200];
            const expectationValues = [10, 50, 100];

            mousePositionValues.forEach((mousePositionValue, i) => {
              const options = {
                boundaries: [0, 100],
                values: [20, 80],
                step: 1,
                isVertical: true,
                hasTooltips: true,
              };
              const model = {
                _options: options,
                isTriggered: false,

                getOptions() {
                  return this._options;
                },

                setOptions(newOptions) {
                  this.isTriggered = true;
                  this._options = {
                    ...options,
                    ...newOptions,
                  };
                },
              };

              new ViewController(parent, model);

              const base = parent.querySelector(JS_BASE_SELECTOR);

              base.style.height = '200px';

              const expectationValue = expectationValues[i];

              simulateMouseEvent('mousedown', base, {
                clientY: mousePositionValue,
              });
              simulateMouseEvent('mouseup', base);

              it(`model setOptions is triggered on mouse event ${i +
                1}`, () => {
                assert.isTrue(model.isTriggered);
              });

              it(`passed value = ${expectationValue} on mouse position = ${mousePositionValue}`, () => {
                assert.deepEqual(expectationValue, model._options.values);
              });
            });
          },
        );

        parent.innerHTML = '';
      });

      describe('shall listen to events on handle element', () => {
        context(
          'trigger model setValueAt method on mousemove during mousedown event',
          () => {
            const mousePositionValues = [20, 100, 200];
            const expectationValues = [
              [0, 10],
              [0, 50],
              [0, 100],
            ];

            mousePositionValues.forEach((mousePositionValue, i) => {
              const options = {
                boundaries: [0, 100],
                values: [20, 80],
                step: 1,
                isVertical: false,
                hasTooltips: true,
              };
              const model = {
                _options: options,
                isTriggered: false,

                getOptions() {
                  return this._options;
                },

                setValueAt(index, newValue) {
                  this.isTriggered = true;
                  this.value = [index, newValue];
                },
              };

              new ViewController(parent, model);

              const base = parent.querySelector(JS_BASE_SELECTOR);
              const handle = parent.querySelector(`.${HANDLE_CLASS_NAME}`);

              base.style.width = '200px';

              const expectationValue = expectationValues[i];

              simulateMouseEvent('mousedown', handle);
              simulateMouseEvent('mousemove', document, {
                clientX: mousePositionValue,
              });
              simulateMouseEvent('mouseup', document);

              it(`model setOptions is triggered on mouse event ${i +
                1}`, () => {
                assert.isTrue(model.isTriggered);
              });

              it(`passed value = ${expectationValue} on mouse position = ${mousePositionValue}`, () => {
                assert.deepEqual(expectationValue, model.value);
              });
            });
          },
        );

        context(
          `trigger model setValueAt method on mousedown event,
        when slider is vertical`,
          () => {
            const mousePositionValues = [20, 100, 200];
            const expectationValues = [
              [0, 10],
              [0, 50],
              [0, 100],
            ];

            mousePositionValues.forEach((mousePositionValue, i) => {
              const options = {
                boundaries: [0, 100],
                values: [20, 80],
                step: 1,
                isVertical: true,
                hasTooltips: true,
              };
              const model = {
                _options: options,
                isTriggered: false,

                getOptions() {
                  return this._options;
                },

                setValueAt(index, newValue) {
                  this.isTriggered = true;
                  this.value = [index, newValue];
                },
              };

              new ViewController(parent, model);

              const base = parent.querySelector(JS_BASE_SELECTOR);
              const handle = parent.querySelector(`.${HANDLE_CLASS_NAME}`);

              base.style.height = '200px';

              const expectationValue = expectationValues[i];

              simulateMouseEvent('mousedown', handle);
              simulateMouseEvent('mousemove', document, {
                clientY: mousePositionValue,
              });
              simulateMouseEvent('mouseup', document);

              it(`model setOptions is triggered on mouse event ${i +
                1}`, () => {
                assert.isTrue(model.isTriggered);
              });

              it(`passed value = ${expectationValue} on mouse position = ${mousePositionValue}`, () => {
                assert.deepEqual(expectationValue, model.value);
              });
            });
          },
        );

        context('remove listeners on mouseup after mousedown event', () => {
          const options = {
            boundaries: [0, 100],
            values: [20, 80],
            step: 1,
            isVertical: true,
            hasTooltips: true,
          };
          const model = {
            _options: options,
            isTriggered: false,

            getOptions() {
              return this._options;
            },

            setOptions(newOptions) {
              this.isTriggered = true;
              this._options = {
                ...options,
                ...newOptions,
              };
            },
          };

          new ViewController(parent, model);

          const slider = parent.querySelector(JS_SLIDER_SELECTOR);
          const handle = parent.querySelector(`.${HANDLE_CLASS_NAME}`);

          slider.style.height = '200px';

          const modelValues = model._options.values.slice();

          simulateMouseEvent('mousedown', handle);
          simulateMouseEvent('mouseup', document);
          simulateMouseEvent('mousemove', document, { clientY: 100 });

          it(`model setOptions is not triggered on mouse event`, () => {
            assert.isFalse(model.isTriggered);
          });

          it(`model values are equal to ${modelValues}`, () => {
            assert.deepEqual(modelValues, model._options.values);
          });
        });

        parent.innerHTML = '';
      });
    });
  });

  describe('update method', () => {
    const parent = document.createElement('div');
    const options = {
      boundaries: [0, 100],
      values: [20, 80],
      step: 1,
      isVertical: true,
      hasTooltips: true,
    };
    const model = {
      _options: options,
      getOptions() {
        return this._options;
      },
    };
    const viewController = new ViewController(parent, model);

    describe('shall set values', () => {
      context(`${HANDLE_GROUP_NAME}s are set`, () => {
        const handleGroups = [
          ...parent.querySelectorAll(JS_HANDLE_GROUP_SELECTOR),
        ];

        handleGroups.forEach((handleGroup, i) => {
          const value = options.values[i];
          const regexp = new RegExp(`${value}`);
          const handleGroupStyle = handleGroup.getAttribute('style');

          it(`${HANDLE_GROUP_NAME}${i + 1} equals to ${value}`, () => {
            assert.isNotNull(handleGroupStyle.match(regexp));
          });
        });
      });
    });

    describe('shall update values', () => {
      const newValues = [10, 60];

      viewController.update({
        boundaries: [0, 100],
        values: newValues,
        isVertical: false,
      });

      context(`${HANDLE_GROUP_NAME}s are updated`, () => {
        const handleGroups = [
          ...parent.querySelectorAll(JS_HANDLE_GROUP_SELECTOR),
        ];

        handleGroups.forEach((handleGroup, i) => {
          const value = newValues[i];
          const regexp = new RegExp(`${value}`);
          const handleGroupStyle = handleGroup.getAttribute('style');

          it(`${HANDLE_GROUP_NAME}${i + 1} equals to ${value}`, () => {
            assert.isNotNull(handleGroupStyle.match(regexp));
          });
        });
      });
    });
  });
});
