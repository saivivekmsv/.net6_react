import { useEffect, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import createPersistedState from 'use-persisted-state';

const useColorSchemeState = createPersistedState('colorScheme');
console.log("hi");


const UseColorScheme = () => {
  const systemPrefersDark = useMediaQuery(
    {
      query: '(prefers-color-scheme: dark)',
    },
    undefined,
  );
  const [isDark, setIsDark] = useColorSchemeState();
  console.log(setIsDark);

  const value = useMemo(() => isDark === undefined ? !!systemPrefersDark : isDark,
    [isDark, systemPrefersDark]);

    console.log(value);


  useEffect(() => {
    if (value) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [value]);
  return {
    isDark: value,
    setIsDark,
  };
}
export default UseColorScheme;
