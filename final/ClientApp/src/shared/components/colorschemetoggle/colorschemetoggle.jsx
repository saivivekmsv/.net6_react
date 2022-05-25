import Toggle from 'react-toggle';
import "react-toggle/style.css" 
//import  UseColorScheme  from "shared/components/usecolorscheme";
import { useMediaQuery } from 'react-responsive';
import React, { useState,useEffect } from 'react';
const ColorSchemeToggle = () => {

    const [isDark, setIsDark] = useState(false);

    console.dir(setIsDark);
    const systemPrefersDark = useMediaQuery(
        {
            query: '(prefers-color-scheme: dark)',
        },
        undefined,
        (isSystemDark) => setIsDark(isSystemDark)
    );
    useEffect(() => {
       
        if (isDark) {
          document.body.dataset.theme="dark"
          //document.body.classList.add('dark');
        } else {
          document.body.removeAttribute("data-theme");
        }
      }, [isDark]);
    return (

        <Toggle
            checked={isDark}
            onChange={({ target }) => setIsDark(target.checked)}
            aria-label="Dark mode"
        />

    );

}

export default ColorSchemeToggle;