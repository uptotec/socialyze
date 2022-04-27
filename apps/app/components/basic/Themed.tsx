/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { ReactChild } from 'react';
import {
  Keyboard,
  Pressable,
  PressableProps,
  StyleSheet,
  Text as DefaultText,
  TouchableWithoutFeedback,
  View as DefaultView,
  TextInput as DefaultTextInput,
} from 'react-native';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import useColorScheme from '../../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: PressableProps & { title: string }) {
  const { onPress, title, style, ...otherButtonProps } = props;
  return (
    <Pressable
      style={{ ...styles.button, ...(style as any) }}
      onPress={onPress}
      {...otherButtonProps}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export const HideKeyboard = ({ children }: { children: ReactChild }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export function TextInput({
  title,
  style,
  ...otherProps
}: DefaultTextInput['props'] & { title: string }) {
  return (
    <View style={{ marginVertical: 7 }}>
      <Text style={styles.small}>{title}</Text>
      <DefaultTextInput
        style={{ ...styles.input, ...(style as any) }}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#00fe9f',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  input: {
    width: Layout.window.width * 0.7,
    height: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  small: {
    color: '#d9d9d9',
    marginLeft: 7,
    marginBottom: 5,
  },
});
