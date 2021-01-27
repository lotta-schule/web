import React from 'react';
import './box.scss';

export const Box: React.FC = ({ children }) => {
  return (
    <div className="box box-with-padding">{children}</div>
  );
};
