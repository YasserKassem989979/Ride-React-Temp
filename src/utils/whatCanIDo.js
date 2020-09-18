// first of all forgive me ...
// this function to get what permissions I have and what actions I can do, it is easy :P
export const whatCanIDo = (permissions) => {
    let actionsICanDo = {};
    permissions.forEach(permission => {

        let permissionSplited = permission.name.split("_");
        let actionName = permissionSplited[0];
        let objectName = permissionSplited[1];
        let statusName = permissionSplited[2];

        if (statusName && statusName !== "WITHOUT") {
            if (actionsICanDo[objectName]) {
                if (actionsICanDo[objectName][statusName] && actionName !== "VIEW") {
                    actionsICanDo[objectName][statusName].push({ label: permission.name, icon: actionName })
                } else if (actionName !== "VIEW") {
                    actionsICanDo[objectName][statusName] = [{ label: permission.name, icon: actionName }];
                } else {
                }
            } else if (actionName !== "VIEW") {
                actionsICanDo[objectName] = { [statusName]: [{ label: permission.name, icon: actionName }] }
            } else {
            }
        } else if (actionName === "CREATE") {
            if (actionsICanDo[objectName]) {
                if (actionsICanDo[objectName][actionName]) {
                    actionsICanDo[objectName][actionName].push({ label: permission.name, icon: actionName })
                } else {
                    actionsICanDo[objectName][actionName] = [{ label: permission.name, icon: actionName }];
                }
            } else {
                actionsICanDo[objectName] = { [actionName]: [{ label: permission.name, icon: actionName }] }
            }
        };
    });
    console.log(actionsICanDo)
    return actionsICanDo;

} 