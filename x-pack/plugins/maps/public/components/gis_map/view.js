/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import { MBMapContainer } from '../map/mb';
import { WidgetOverlay } from '../widget_overlay/index';
import { LayerPanel } from '../layer_panel/index';
import { AddLayerPanel } from '../layer_addpanel/index';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { Toasts } from '../toasts';

export class GisMap extends Component {

  componentDidMount() {
    this.setRefreshTimer();
  }

  componentDidUpdate() {
    this.setRefreshTimer();
  }

  componentWillUnmount() {
    this.clearRefreshTimer();
  }

  setRefreshTimer = () => {
    const { isPaused, interval } = this.props.refreshConfig;

    if (this.isPaused === isPaused && this.interval === interval) {
      // refreshConfig is the same, nothing to do
      return;
    }

    this.isPaused = isPaused;
    this.interval = interval;

    this.clearRefreshTimer();

    if (!isPaused && interval > 0) {
      this.refreshTimerId = setInterval(
        () => {
          this.props.triggerRefreshTimer();
        },
        interval
      );
    }
  }

  clearRefreshTimer = () => {
    if (this.refreshTimerId) {
      clearInterval(this.refreshTimerId);
    }
  }

  render() {
    const {
      layerDetailsVisible,
      addLayerVisible,
      noFlyoutVisible
    } = this.props;

    let currentPanel;
    let currentPanelClassName;

    if (noFlyoutVisible) {
      currentPanel = null;
    } else if (addLayerVisible) {
      currentPanelClassName = "mapMapLayerPanel-isVisible";
      currentPanel = <AddLayerPanel/>;
    } else if (layerDetailsVisible) {
      currentPanelClassName = "mapMapLayerPanel-isVisible";
      currentPanel = (
        <LayerPanel/>
      );
    }
    return (
      <EuiFlexGroup gutterSize="none" responsive={false}>
        <EuiFlexItem className="mapMapWrapper">
          <MBMapContainer/>
          <WidgetOverlay/>
        </EuiFlexItem>

        <EuiFlexItem className={`mapMapLayerPanel ${currentPanelClassName}`} grow={false}>
          {currentPanel}
        </EuiFlexItem>

        <Toasts/>
      </EuiFlexGroup>
    );
  }
}
