import isUndefined from "lodash/isUndefined";

import { findRatio } from "./utilities";
import {
  findValuePositionBetween,
  findValueByRatioBetween,
  createTemplate,
} from "./helpers";

export class SliderUI {
  constructor($parent, model) {
    this.$parent = $parent;
    this.model = model;

    this._handleSliderMouseDown = this._handleSliderMouseDown.bind(this);
    this._handleDocumentMouseMove = this._handleDocumentMouseMove.bind(this);
    this._handleDocumentMouseUp = this._handleDocumentMouseUp.bind(this);

    this._paint(model.getOptions());
    this._assignElements();
    this._addEventListener();
    this.setElements(model.getOptions());
  }

  setElements({ boundaries, values, orientation } = {}) {
    const positions = values.map((value) =>
      findValuePositionBetween(value, ...boundaries),
    );

    if (orientation === "horizontal") {
      this._setHandleGroupHorizontalPositions(positions);
    } else {
      this._setHandleGroupVerticalPositions(positions);
    }

    this._setTooltipTextContents(values);
  }

  _setHandleGroupHorizontalPositions(positions) {
    this.$handleGroups.forEach(($handleGroup, i) => {
      $handleGroup.style.left = positions[i];
    });
  }

  _setHandleGroupVerticalPositions(positions) {
    this.$handleGroups.forEach(($handleGroup, i) => {
      $handleGroup.style.top = positions[i];
    });
  }

  _setTooltipTextContents(values) {
    this.$tooltips.forEach(($tooltip, i) => {
      $tooltip.textContent = values[i];
    });
  }

  _paint(options) {
    this.$parent.innerHTML = createTemplate(options);
  }

  _assignElements() {
    this.$slider = this.$parent.querySelector(".slider");
    this.$base = this.$parent.querySelector(".slider__base");
    this.$handleGroups = this._getHandleGroups();
    this.$tooltips = this._getTooltips();
  }

  _getHandleGroups() {
    return Array.from(this.$parent.querySelectorAll(".slider__handle-group"));
  }

  _getTooltips() {
    return Array.from(this.$parent.querySelectorAll(".slider__tooltip"));
  }

  _addEventListener() {
    this.$slider.onmousedown = this._handleSliderMouseDown;
  }

  _handleSliderMouseDown(event) {
    event.preventDefault();

    const { orientation } = this.model.getOptions();
    const newValue =
      orientation === "horizontal"
        ? this._convertCoordinateToValue({ xCoordinate: event.clientX })
        : this._convertCoordinateToValue({ yCoordinate: event.clientY });

    const target = event && event.target;

    if (target === this.$base) {
      this.model.setOptions({ values: newValue });
    }

    const currentHandleGroup =
      target && target.closest(".slider__handle-group");

    if (currentHandleGroup) {
      this._handleHandleGroupMouseDown(currentHandleGroup);
    }
  }

  _handleHandleGroupMouseDown(currentHandleGroup) {
    this._handleDocumentMouseMoveBlocked = (currentEvent) =>
      this._handleDocumentMouseMove.call(
        this,
        currentEvent,
        currentHandleGroup,
      );

    document.addEventListener(
      "mousemove",
      this._handleDocumentMouseMoveBlocked,
    );
    document.addEventListener("mouseup", this._handleDocumentMouseUp);
  }

  _handleDocumentMouseMove(currentEvent, currentHandleGroup) {
    const index = Number(currentHandleGroup.dataset.index);

    const { orientation } = this.model.getOptions();
    const newValue =
      orientation === "horizontal"
        ? this._convertCoordinateToValue({
            xCoordinate: currentEvent.clientX,
          })
        : this._convertCoordinateToValue({
            yCoordinate: currentEvent.clientY,
          });

    this.model.setValueAt(index, newValue);
  }

  _handleDocumentMouseUp() {
    document.removeEventListener(
      "mousemove",
      this._handleDocumentMouseMoveBlocked,
    );
    document.removeEventListener("mouseup", this._handleDocumentMouseUp);
  }

  _convertCoordinateToValue({ xCoordinate, yCoordinate }) {
    const [adjustedCoordinate, sliderSize] = !isUndefined(xCoordinate)
      ? [this._adjustToSliderXCoordinate(xCoordinate), this._getSliderWidth()]
      : [this._adjustToSliderYCoordinate(yCoordinate), this._getSliderHeight()];

    const ratio = findRatio(adjustedCoordinate, sliderSize);
    const { boundaries } = this.model.getOptions();

    return findValueByRatioBetween(ratio, ...boundaries);
  }

  _adjustToSliderXCoordinate(xCoordinate) {
    return xCoordinate - this.$slider.getBoundingClientRect().left;
  }

  _adjustToSliderYCoordinate(yCoordinate) {
    return yCoordinate - this.$slider.getBoundingClientRect().top;
  }

  _getSliderWidth() {
    return this.$slider.getBoundingClientRect().width;
  }

  _getSliderHeight() {
    return this.$slider.getBoundingClientRect().height;
  }
}
