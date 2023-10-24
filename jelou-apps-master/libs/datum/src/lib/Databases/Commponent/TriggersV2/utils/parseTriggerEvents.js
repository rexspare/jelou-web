export const parseTriggerEvents = (triggerEvents, lang) => {
    return triggerEvents.map((triggerEvent) => {
        return {
            value: triggerEvent.id,
            label: triggerEvent.displayNames[lang],
        }
    })
}