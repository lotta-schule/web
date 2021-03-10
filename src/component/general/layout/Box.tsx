import React from "react";
import clsx from "clsx";
import "./box.scss";

interface BoxProps {
  noMargin?: boolean;
  marginTop?: boolean;
  fullWidth?: boolean;
}

export const Box: React.FC<BoxProps> = ({
  children,
  noMargin,
  marginTop,
  fullWidth,
}) => {
  return (
    <div
      className={clsx("box", {
        "margin-top": marginTop,
        "no-margin": noMargin,
        "full-width": fullWidth,
      })}
    >
      {children}
    </div>
  );
};
