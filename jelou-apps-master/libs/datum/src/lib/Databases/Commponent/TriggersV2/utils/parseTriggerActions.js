export const parseTriggerActions = (triggerActions, lang) => {
    return triggerActions.map((triggerAction) => {
        return {
            value: triggerAction.value,
            label: triggerAction.label[lang],
        }
    })
}