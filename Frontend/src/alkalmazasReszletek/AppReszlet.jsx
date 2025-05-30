import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppReszletStilus from './AppReszlet.css';
import Kovetelmeny from './Kovetelmeny';
import VisszaOsszesitobe from './VisszaOsszesitobe';


function AppReszlet() {
    const location = useLocation();
    const appNev = location.state.nev;

    var [appAdat, setAppAdat] = useState('');
    const [betoltA, setBetoltA] = useState(true);
    var [appKovetelmeny, setAppKovetelmeny] = useState('');
    const [betoltK, setBetoltK] = useState(true);
    const [betoltM, setBetoltM] = useState(true);
    const [betoltO, setBetoltO] = useState(true);
    var [minimumK, setMinimumK] = useState('');
    var [optimumK, setOptimumK] = useState('');
    var [tarhelyAdat, setTarhelyAdat] = useState('');
    var [kepUrl, setKepUrl] = useState('');

    async function getAppAdat() {
      try {
        const response = await fetch(`https://localhost:44316/api/Applikacio/0?name=${appNev}`);
        const data = await response.json();
        setAppAdat(data);
        setBetoltA(false);
        setKepUrl(data.KepeleresiUtja ? `/IMAGE/nagy.${data.KepeleresiUtja}` : '/IMAGE/nagy.hiany.jpg');
    } catch (error) {
        console.error(error);
      }
    }
    useEffect(() => { getAppAdat(); }, []);

    async function getKovetelmeny() {
        try{
            const response = await fetch(`https://localhost:44316/api/Setup/0?name=${appNev}`);
            const data = await response.json();
            setAppKovetelmeny(data);
            setBetoltK(false);
        } catch (error){
            console.error(error);
        }
    }
    useEffect(() => { getKovetelmeny(); }, []);

    useEffect(() => {
        if(!(betoltA && betoltK)){
            if(appKovetelmeny[0] == undefined) setTarhelyAdat('- ')
            for(let elem of appKovetelmeny){
                if(elem.Gepigeny=='min') {
                    setMinimumK(elem);
                    setBetoltM(false);
                }
                else if(elem.Gepigeny=='opt') {
                    setOptimumK(elem);
                    setBetoltO(false);
                }
            }
        }
    }, [betoltA, betoltK])

  return (
    <div className='keret'>
        <div className='tartalom'>
            <div className='oszlopok'>
                <div className='balOSzlop'>
                    <h1 className='appNev'>{appAdat.Nev}</h1>
                    <div className='elem'>
                        <h2 className='sorCim'>Kategória: </h2>
                        <h2 className='sorTartalom'>{betoltA ? '-' : appAdat.KategoriaNev}</h2>
                    </div>
                    <div className='elem'>
                        <h2 className='sorCim'>Szükséges tárhely: </h2>
                        <h2 className='sorTartalom'>{betoltA ? '-' : appAdat.Tarhely } GB</h2>
                    </div>
                </div>
                <div className='jobOSzlop'>
                    <img src={kepUrl} className='nagyKep' onError={() => { setKepUrl(`/IMAGE/logo.${appAdat.KepeleresiUtja}`); }}></img>
                </div>
            </div>
            
            <div className='minimum'>
                <Kovetelmeny adatok={betoltM ? '-' : minimumK}></Kovetelmeny>
            </div>

            <div className='optimum'>
                <Kovetelmeny adatok={betoltO ? '-' : optimumK}></Kovetelmeny>
            </div>
            
        </div>
        <VisszaOsszesitobe></VisszaOsszesitobe>
    </div>
  );
}

export default AppReszlet;