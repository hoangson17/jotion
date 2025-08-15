import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { EntityManager } from "typeorm";

@ValidatorConstraint({name:'customText',async:false})
export class Unique implements ValidatorConstraintInterface{
    constructor (private readonly entityManager:EntityManager){}

    async validate(value:string, args: ValidationArguments){
        if(!value){
            return true;
        }
        const [table, column, ignoreColumn] = args.constraints;
        console.log(ignoreColumn);
        console.log(args.object);

        // query builder
        const query = this.entityManager.getRepository(table).createQueryBuilder(table).where(`${table}.${column} = :value`,{
            value,
        });
        
        if(ignoreColumn && args.object[ignoreColumn]){
            query.andWhere(`${table}.${ignoreColumn} !=:ignoreValue`,{
                ignoreValue:args.object[ignoreColumn],
            })
        }

        const count = await query.getCount();
        if(count > 0){
            return false;
        }

        return true;
    }

    defaultMessage(args?: ValidationArguments ){
        return 'Value ($value) is exits';
    }
}