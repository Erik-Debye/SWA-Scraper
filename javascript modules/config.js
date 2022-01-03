'use strict';

//This is where you set your Supabase URL and Api Key. Depending how you have your RLS and policies set up, you might need to use your nonpublic key. I used my public key as I do not have policies set up and have not shared this yet. You can find this info in the supbase UI by hitting the settings btn on the lefthand navigation within your project and then hitting the API btn within the lefthand Project Settings section.

const supabaseURL = `YOUR CONFIGURATION URL`;
const publicAPIKey = `YOUR API KEY`;

//This is where you set when you want to scrap the data from. By default it scraps from the current day, but increasing the months value will traverse that many months forward and similar for the days value. For example, if today was 01/05/22 to get prices from 05/16/2022 you would change the 'months' value to 4 and the 'days' value to 11.

const months = 0;
const days = 0;