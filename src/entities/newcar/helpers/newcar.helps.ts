import { Logger } from "@nestjs/common"
import { createHash } from 'crypto'
import { NewCar } from "../model/newcar.model"

export class NewCarHelps {

    static groupCarsByHash(cars: NewCar[]): NewCar[] {
        const carsHashMap = new Map<string, NewCar>()
        let repeatedHashes = 0
        let uniqueHashes = 0
        for(let car of cars) {
          const params = `${car.brand}${car.model}${car.year.toString()}${car.price.toString()}`
          const key = this.createSha256(params)
          const existingHash = carsHashMap.get(key)
          if(existingHash) {
            repeatedHashes++
            let temp = existingHash
            if(Array.isArray(temp.colours)) {
              const currentColor = car.colours as string
              if(temp.colours.indexOf(currentColor) === -1) temp.colours.push(currentColor)
            }
            carsHashMap.set(key, temp)
          }
          else {
            uniqueHashes++
            if(!Array.isArray(car.colours)) {
              car.colours = [car.colours]
            }
            carsHashMap.set(key, car)
          }
        }
        const resultArray = Array.from(carsHashMap.values())
        Logger.debug({uniqueHashes, repeatedHashes})
        // let masterColorArray = []
        // for(let car of resultArray) {
        //   for(let color of car.colours) {
        //     masterColorArray.push(color)
        //   }
        // }
        // Logger.debug(masterColorArray)
        return resultArray
    }

        
    static createSha256(str: string) {
        return createHash('sha256').update(str).digest('hex')
    }
    
    static stringToUrl(str: string) {
        return str.toLowerCase().replace(/ /g, '-')
    }
    
}