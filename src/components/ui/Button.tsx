import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 active:bg-primary-700",
  secondary:
    "bg-primary-50 active:bg-primary-100",
  outline:
    "bg-transparent active:bg-slate-50 border-2 border-slate-200",
  ghost:
    "bg-transparent active:bg-slate-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5",
  md: "px-6 py-3.5",
  lg: "px-6 py-4",
};

const textVariantStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-primary-700",
  outline: "text-slate-700",
  ghost: "text-primary-600",
};

const sizeTextStyles: Record<ButtonSize, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-base font-bold tracking-wide",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = true,
  className = "",
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.88}
      className={[
        "flex-row items-center justify-center rounded-2xl",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-50" : "",
        variant === "primary" && !isDisabled ? "shadow-md" : "",
        className,
      ].join(" ")}
      style={
        variant === "primary" && !isDisabled
          ? {
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
              ...(style as object),
            }
          : (style as object)
      }
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#FFFFFF" : "#2563EB"}
        />
      ) : (
        <Text
          className={[
            textVariantStyles[variant],
            sizeTextStyles[size],
          ].join(" ")}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
