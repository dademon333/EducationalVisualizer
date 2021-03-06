import EntityType from "../enums/entity-type.enum";
import ISelect from "../interfaces/control/select.interface";
import store from "../redux/store";

/** 
 * Получить цвет для сущности
 * @returns hex
 * @example #57A773
 */
export function getEntityColor(entityType: EntityType): string {
    switch (entityType) {
        case EntityType.Activity:
            return "#57A773";
        case EntityType.Competence:
            return "#EE6352";
        case EntityType.Course:
            return "#08B2E3";
        case EntityType.Knowledge:
            return "#F39237";
        case EntityType.Metric:
            return "#FFBEEF";
        case EntityType.Profession:
            return "#EE6055";
        case EntityType.Quantum:
            return "#264653";
        case EntityType.Skill:
            return "#F3F9D2";
        case EntityType.SuosCompetence:
            return "#4C4C4C";
        case EntityType.Target:
            return "#226CE0";
        case EntityType.Task:
            return "#FED766";
        case EntityType.Theme:
            return "#700353";
    }
}


export function entitiesToSelectItems(type?: EntityType): ISelect<EntityType>[] {
    let entities = Object.entries(store.getState().entitiesConnections.entities);
    if (type) {
        entities = entities.filter(el => el[1].type === type);
    }

    return entities.map(el =>  {return {id: el[0],name: el[1].name}});
}

export function getAllEntityTypes(): EntityType[] {
    return Object.values(EntityType);
}