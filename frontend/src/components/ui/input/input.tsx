import { forwardRef, InputHTMLAttributes } from 'react';

export type InputProps = {
  onEnterKeyPressed?: (value?: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onEnterKeyPressed, ...restProps }, ref) => {
    return (
      <input
        {...restProps}
        ref={ref}
        onKeyDown={(event) => {
          if (restProps.onKeyDown) {
            restProps.onKeyDown(event);
          }
          if (
            event.key === 'Enter' &&
            !event.nativeEvent.isComposing &&
            onEnterKeyPressed
          ) {
            onEnterKeyPressed(event.currentTarget.value);
          }
        }}
      />
    );
  },
);
