
"use client";
import React from 'react';
import { GridEngineHeadless, Tilemap } from 'grid-engine';

interface AsciiRendererProps {
  gridEngine: GridEngineHeadless;
  tilemap: Tilemap;
}

interface AsciiRendererState {
  asciiMap: string;
}

export class AsciiRenderer extends React.Component<AsciiRendererProps, AsciiRendererState> {
  constructor(props: AsciiRendererProps) {
    super(props);
    this.state = {
      asciiMap: '',
    };
  }

  componentDidMount() {
    this.renderAsciiMap();
  }

  componentDidUpdate(prevProps: AsciiRendererProps) {
    // Re-render only if gridEngine or tilemap has changed
    if (this.props.gridEngine !== prevProps.gridEngine || this.props.tilemap !== prevProps.tilemap) {
      this.renderAsciiMap();
    }
  }

  renderAsciiMap = (): void => {
    const { gridEngine, tilemap } = this.props;
    const strArr: string[] = [];
    for (let r = 0; r < tilemap.getHeight(); r++) {
      for (let c = 0; c < tilemap.getWidth(); c++) {
        const pos = { x: c, y: r };
        if (gridEngine.getCharactersAt(pos).length > 0) {
          strArr.push('c');
        } else if (gridEngine.isTileBlocked(pos)) {
          strArr.push('#');
        } else {
          strArr.push('.');
        }
      }
      strArr.push('\n');
    }
    this.setState({ asciiMap: strArr.join('') });
  };

  render() {
    return <pre>{this.state.asciiMap}</pre>;
  }
}

export default AsciiRenderer;