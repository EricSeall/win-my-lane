import { useEffect, useState } from "react";
import "./App.css";
import { Name } from "./types";

function App() {
	const [tips, setTips] = useState<Array<string>>();
	const [query, setQuery] = useState<string>("");
	const [championNames, setChampionNames] = useState<Array<Name>>([]);
	const [latestVersion, setLatestVersion] = useState<string>("");
	const [activeChamp, setActiveChamp] = useState<string>("");
	// get list of champions on app start and load into championNames
	useEffect(() => {
		getChamps();
	}, []);

	async function getChamps() {
		//to get the latest version of league for use with other fetch calls
		const versionInfo = await fetch(
			"https://ddragon.leagueoflegends.com/api/versions.json"
		);
		const version = await versionInfo.json();

		setLatestVersion(version[0]);

		// have to use "version" here because state hasn't updated yet
		const res = await fetch(
			`https://ddragon.leagueoflegends.com/cdn/${version[0]}/data/en_US/champion.json`
		);
		const data = await res.json();

		if (res.ok) {
			// take champions from data and also get their name properties (they have correct spacing and punctuation)
			setChampionNames(
				Object.keys(data.data).map((name) => {
					return { commonName: data.data[name].name, dataName: name };
				})
			);
		}
		console.log(data.data);
	}

	async function queryData(champ: string) {
		const res = await fetch(
			`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champ}.json`
		);
		const data = await res.json();

		if (res.ok) {
			setTips(data.data[champ].enemytips);
			setActiveChamp(champ);
			console.log(data.data[champ].enemytips);
		}
	}

	return (
		<>
			<div className="bg h-screen absolute top-0 left-0 w-screen" />
			<div className="main-content flex h-screen justify-center items-center">
				<div className="block m-auto">
					<h1 className="block text-center m-auto font-bold text-6xl mb-16 text-GOLD-1 bg-gradient-to-b from-BLUE-7 to-BLUE-6 border-2 rounded-lg border-GOLD-4 p-4">
						Win My Lane
					</h1>
					<input
						className="text-black block mx-auto w-64"
						onChange={(e) => {
							setQuery(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								queryData(e.target.value);
							}
						}}
						placeholder="Enter Champion Name:"
					/>
					<div className="autosuggest mx-auto w-64">
						{championNames
							.filter((name) => {
								return query.toLowerCase() === ""
									? false
									: name.commonName.toLowerCase().startsWith(query.toLowerCase());
							})
							.map((name, index) => (
								//TODO: make into components
								<div
									className="champ-tile hover:scale-110 transition-all"
									key={index}
									onClick={() => queryData(name.dataName)}
								>
									<img
										className="inline"
										src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${name.dataName}.png`}
										alt={`${name.commonName} icon`}
										width="30"
										height="30"
									/>
									<span className="pl-2">
										{name.commonName}
										<br />
									</span>
								</div>
							))}
					</div>
					<div className="text-GOLD-1 mt-16 bg-gradient-to-b from-BLUE-7 to-BLUE-6 border-2 rounded-lg border-GOLD-4 p-4">
						{tips &&
							tips.map((tip) => (
								<p key={tip} className="text-xl text-center animate-in mb-4">
									"{tip}"
								</p>
							))}
						{tips && tips.length === 0 && (
							<p key={activeChamp} className="text-center animate-in">
								I've got nothin'. Just get good I guess.
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
