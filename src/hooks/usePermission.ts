import { useSearchParams } from "react-router-dom";

type Role = "owner" | "editor";

type PermissionHookResponse = {
    role: Role;
    permissibleSlides: "all" | string[];
    canEditDeck: boolean;
    canInvite: boolean;
    canEditSlide: (slideId: string) => boolean;
}

export const usePermission = (): PermissionHookResponse => {
    const [searchParams] = useSearchParams();

    const role = (searchParams.get("role") as Role )?? "owner";
    const editableSlides = searchParams.get("slides");
    const permissibleSlides = editableSlides ? editableSlides.split(',') : "all";
    const canEditDeck = role === "owner";
    const canInvite = role === "owner";

    const canEditSlide = (slideId: string) => {
        if (role === "owner" || permissibleSlides === "all")
            return true;

        const editableSet = new Set(permissibleSlides);
        return editableSet.has(slideId);
    }

    return {
        role,
        permissibleSlides,
        canEditDeck,
        canInvite,
        canEditSlide
    }
}