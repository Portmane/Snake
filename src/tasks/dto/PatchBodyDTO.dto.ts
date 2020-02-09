export class PatchBodyDTO {
    constructor(id: string, property: string, value: string) {
        this.id = id;
        this.property = property;
        this.value = value;
    }

    id: string;
    property: string;
    value: string;
}