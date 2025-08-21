import React, { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

const ErrorState = ({ error, onRetry, maxAttempts = 5, retryDelay = 5 }) => {
  // state declarations
  const [attempts, setAttempts] = useState(0);
  const [countDown, setCountDown] = useState(retryDelay);
  const [isPermanent, setIsPermanent] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!error || !onRetry) return;

    if (attempts < maxAttempts && !isPermanent) {
      const timer = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsRetrying(true);

            setTimeout(() => {
              setAttempts((a) => a + 1);
              setCountDown(retryDelay);
              setIsRetrying(false);
              onRetry();
            }, 800);

            return retryDelay; // reset immediately instead of going to 0
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (attempts >= maxAttempts) {
      setIsPermanent(true);
    }
  }, [attempts, isPermanent, onRetry, error, maxAttempts, retryDelay]);

  const handleManualRetry = () => {
    if (isPermanent && onRetry) {
      setAttempts(0);
      setCountDown(retryDelay);
      setIsPermanent(false);
      setIsRetrying(true);

      setTimeout(() => {
        setIsRetrying(false);
        onRetry();
      }, 800);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!error) return null;

  return (
    <div className="error-state">
      <div className="error-state__container">
        <div className="error-state__content">
          {/* Icon Container */}
          <div
            className={`icon-container ${
              isPermanent
                ? "icon-container--critical"
                : isRetrying
                ? "icon-container--retrying"
                : ""
            }`}
          >
            {isPermanent ? (
              <AlertTriangle />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Error"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="7" x2="12" y2="13" />
                <circle cx="12" cy="17" r="1" />
              </svg>
            )}
          </div>

          {/* Message Block */}
          <div className="message-block">
            <div className="message-block__title">
              {isPermanent ? "Connection Failed" : "Temporary Issue"}
            </div>
            <div className="message-block__description">
              {error || "Oops something went wrong"}
            </div>
          </div>

          {/* Retry Status */}
          {!isPermanent && onRetry && (
            <div className="retry-status">
              {isRetrying ? (
                <div className="retry-status__retrying">
                  <RefreshCw size={16} className="retry-icon" />
                  <span>Retrying...</span>
                </div>
              ) : (
                <div className="retry-status__countdown">
                  <div className="retry-status__countdown-circle">
                    <span className="retry-status__countdown-number">
                      {countDown}
                    </span>
                    <svg
                      className="retry-status__countdown-ring"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="retry-status__countdown-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="retry-status__countdown-progress"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{
                          strokeDasharray: `${
                            ((retryDelay - countDown + 1) / retryDelay) * 100
                          }, 100`,
                        }}
                      />
                    </svg>
                  </div>
                  <div className="retry-status__countdown-text">
                    Auto-retry in <strong>{countDown}</strong> seconds
                  </div>
                </div>
              )}
              <div className="retry-status__attempt-counter">
                Attempt {Math.min(attempts + 1, maxAttempts)} of {maxAttempts}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="error-actions">
            {isPermanent ? (
              <>
                {onRetry && (
                  <button
                    className="error-actions__btn error-actions__btn--primary"
                    onClick={handleManualRetry}
                    disabled={isRetrying}
                  >
                    <RefreshCw
                      size={16}
                      className={`btn-icon ${
                        isRetrying ? "btn-icon--spinning" : ""
                      }`}
                    />
                    {isRetrying ? "Retrying..." : "Try Again"}
                  </button>
                )}
                <button
                  className="error-actions__btn error-actions__btn--secondary"
                  onClick={handleReload}
                >
                  Reload Page
                </button>
              </>
            ) : (
              onRetry && (
                <button
                  className="error-actions__btn error-actions__btn--ghost"
                  onClick={handleManualRetry}
                  disabled={isRetrying}
                >
                  <RefreshCw
                    size={16}
                    className={`btn-icon ${
                      isRetrying ? "btn-icon--spinning" : ""
                    }`}
                  />
                  Retry Now
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
