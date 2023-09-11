import { GetBuildingContext } from './ContextProvider';
import { House } from './House';
import './InputComponent.css';

function InputComponent() {

    const {building, setBuilding} = GetBuildingContext();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
    
        const newCorner1X = parseFloat((event.target as any).corner1X.value);
        const newCorner1Y = parseFloat((event.target as any).corner1Y.value);
        const newCorner2X = parseFloat((event.target as any).corner2X.value);
        const newCorner2Y = parseFloat((event.target as any).corner2Y.value);
        const newCorner3X = parseFloat((event.target as any).corner3X.value);
        const newCorner3Y = parseFloat((event.target as any).corner3Y.value);
        const newCorner4X = parseFloat((event.target as any).corner4X.value);
        const newCorner4Y = parseFloat((event.target as any).corner4Y.value);
        const newNumFloors = parseInt((event.target as any).numFloors.value);
    
        const newBuilding = new House([
          [newCorner1X, 0, newCorner1Y],
          [newCorner2X, 0, newCorner2Y],
          [newCorner3X, 0, newCorner3Y],
          [newCorner4X, 0, newCorner4Y]
        ], newNumFloors);
    
        setBuilding(newBuilding);
      };
      
      
    return (
        <form onSubmit={handleSubmit} id="input-form">
            <div className="input-container">
                <div className="input-row">
                    <label htmlFor="corner1X">Corner 1 X:</label>
                    <input type="number" id="corner1X" defaultValue={building.positions[0][0]}/>
                    <label htmlFor="corner1Y">Corner 1 Y:</label>
                    <input type="number" id="corner1Y" defaultValue={building.positions[0][2]}/>
                </div>
                <div className="input-row">
                    <label htmlFor="corner2X">Corner 2 X:</label>
                    <input type="number" id="corner2X" defaultValue={building.positions[1][0]}/>
                    <label htmlFor="corner2Y">Corner 2 Y:</label>
                    <input type="number" id="corner2Y" defaultValue={building.positions[1][2]}/>
                </div>
                <div className="input-row">
                    <label htmlFor="corner3X">Corner 3 X:</label>
                    <input type="number" id="corner3X" defaultValue={building.positions[2][0]}/>
                    <label htmlFor="corner3Y">Corner 3 Y:</label>
                    <input type="number" id="corner3Y" defaultValue={building.positions[2][2]}/>
                </div>
                <div className="input-row">
                    <label htmlFor="corner4X">Corner 4 X:</label>
                    <input type="number" id="corner4X" defaultValue={building.positions[3][0]}/>
                    <label htmlFor="corner4Y">Corner 4 Y:</label>
                    <input type="number" id="corner4Y" defaultValue={building.positions[3][2]}/>
                </div>
                <div className="input-row">
                    <label htmlFor="numFloors">Number of Floors:</label>
                    <input type="number" id="numFloors" defaultValue={building.numOfFloors}/>
                </div>
                <button type="submit">Update Model</button>
            </div>
        </form>
    );
}

export default InputComponent;