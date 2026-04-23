import React from 'react'
import style from "./style.module.css"
import Button from "../button"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={style.mainWrapper}>
          <div className={style.popupContainer}>
            <span className={style.title}>Error</span>
            <span className={style.message}>Unable to load file</span>
            <div className={style.actionsWrapper}>
              <Button onClick={() => window.location.reload()} text="Ok" />
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary