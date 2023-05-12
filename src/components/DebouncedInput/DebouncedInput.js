import React, { useCallback } from 'react';
import debounce from 'lodash/debounce';

const DebouncedInput = React.forwardRef((props, ref) => {
  const {
    className,
    delay = 500,
    onChange,
    type,
    placeholder,
    id,
    disabled,
  } = props;

  const handleChange = useCallback(
    debounce((query) => {
      try {
        onChange(query);
      } catch (error) {
        console.error(error);
      }
    }, delay),
    [onChange, delay]
  );

  return (
    <input
      id={id}
      className={className}
      type={type}
      disabled={disabled}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      ref={ref}
    />
  );
});

DebouncedInput.displayName = 'DebouncedInput';

export default DebouncedInput;
