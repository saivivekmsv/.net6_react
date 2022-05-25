import React from 'react';
//https://github.com/francois-roget/permission-provider-demo/blob/master/src/PermissionProvider/PermissionContext.ts

const defaultBehaviour = {
    isAllowedTo: () => Promise.resolve(false)
}

const PermissionContext = React.createContext(defaultBehaviour);
export default PermissionContext;