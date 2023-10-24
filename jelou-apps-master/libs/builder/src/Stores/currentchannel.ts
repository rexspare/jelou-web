import { ChannelTypes } from "@builder/modules/Channels/domain/channels.domain";
import { create } from "zustand";
import { CurrentChannelStore } from "./types.stores";

export const currentChannelStore = create<CurrentChannelStore>((set) => ({
    currentTypeChannel: ChannelTypes.WHATSAPP,
    setCurrentTypeChannel: (channelType) => set({ currentTypeChannel: channelType }),
}));
