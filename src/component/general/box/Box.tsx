import React from 'react';
import './box.scss';

export const Box: React.FC = ({ children }) => {
  return (
    <div className="box">{children}</div>
  );
};
