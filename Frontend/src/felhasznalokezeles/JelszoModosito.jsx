import { useState, useEffect } from 'react';
import Stilus from './Felh.css';

function JelszoModosito() {
  function hibaKiiratas(uzenet){
    document.getElementById('hibaSzoveg').innerText=uzenet;
    document.getElementById('hibaU').style.display='grid';
  }

  function jelszoFrissites(){
    let jelszo1 = document.getElementById('uJel1').value;
    let jelszo2 = document.getElementById('uJel2').value;
    if(jelszo1=='' || jelszo2==''){
        hibaKiiratas('Töltse ki mindkét mezőt !');
    }
    else if(jelszo1 != jelszo2) {
        hibaKiiratas('A két jelszó nem egyezik !');
    }
    else {
        frissitFetch(JSON.parse(localStorage.getItem('loggedInUser')).Id,JSON.parse(localStorage.getItem('loggedInUser')).Email, jelszo1);
    }
  }

    async function frissitFetch(id, email, ujJelszo) {
        const response = await fetch(`https://localhost:44316/api/Profil/ProfilJelszoUpdateModel?id=${id}&email=${email}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ UjJelszo: ujJelszo })
        });

        if(!response.ok){
            //401
            if(response.status === 401){
                hibaKiiratas("Hibás a jelszó !")
            }
            else if(response.status === 404){
                hibaKiiratas("Az e-mail cím nem található !")
            }
            else{
                hibaKiiratas("Szerver hiba. Kérlek próbáld meg később!")
                throw new Error(`HTTP hiba! Státuszkód: ${response.status}`)
            }
            throw new Error(`HTTP hiba! Státuszkód: ${response.status}`)
        }
        else{
            hibaKiiratas("A jelszó módosítása sikeres volt !");
            document.getElementById('uJel1').value='';
            document.getElementById('uJel2').value='';
        }
    }

  return (
    <div className='jelszoMod'>
        <p className='jelszoModCim'>Jelszó Módosítása</p>
        <div className='ujJelszo'>
          <div className='menuEle'>
            <p className='beallitasNeve'>Módosított Jelszó:</p>
            <input type='password' id='uJel1'></input>
          </div>
          <div className='menuEle'>
            <p className='beallitasNeve'>Módosított Jelszó Újra:</p>
            <input type='password' id='uJel2'></input>
          </div>
          <button className='jelszoMentes' onClick={jelszoFrissites}>Jelszó Frissítése</button>
        </div>
      </div>
  );
}

export default JelszoModosito;