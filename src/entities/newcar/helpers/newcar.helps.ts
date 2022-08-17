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

    static getBaseColour(colour: string) {
      const colourTab = [
        { name: 'Rojo', hex: '#9e0705' },
        { name: 'Azul', hex: '#052e9e' },
        { name: 'Blanco', hex: '#ffffff' },
        { name: 'Negro', hex: '#000000' },
        { name: 'Gris', hex: '#575757' },
        { name: 'Plata', hex: '#8f8f8f' },
        { name: 'Cafe', hex: '#301501' },
        { name: 'Beige', hex: '#fff0db' },
        { name: 'Olivo', hex: '#808000' },
        { name: 'Marfil', hex: '#fffff0' },
        { name: 'Marron', hex: '#804000' },
        { name: 'Ceniza', hex: '#7b8084' },
        { name: 'Gobi', hex: '#baa486' },
        { name: 'Turquesa', hex: '#3f888f' },
        { name: 'Verde', hex: '#008f39' },
        { name: 'Granito', hex: '#2f353b' },
        { name: 'Cinza', hex: '#484d50' },
        { name: 'Cobre', hex: '#8e402a' },
      ]
      colour = colour.charAt(0).toUpperCase() + colour.toLowerCase().slice(1).trim()
      const baseColour = colour.split(' ')[0]
      const foundColour = colourTab.find(
        (colourObject: {name: string, hex: string}) => colourObject.name === baseColour
      );
      return foundColour ? foundColour.name : 'Otros'
  }
    
}