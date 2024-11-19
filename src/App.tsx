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
	}

	async function queryData(champ: string) {
		const res = await fetch(
			`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champ}.json`
		);
		const data = await res.json();

		if (res.ok) {
			setTips(data.data[champ].enemytips);
			setActiveChamp(champ);
		}
	}

	return (
		<>
			<div className="bg h-screen absolute top-0 left-0 w-screen" />
			<div className="main-content flex h-screen justify-center items-start">
				<div className="block mx-auto w-80 sm:w-[160rem] max-w-lg">
					<h1 className="block text-center mx-auto font-bold text-4xl sm:text-6xl mb-16 mt-8 text-GOLD-1 bg-gradient-to-b from-BLUE-7 to-BLUE-6 border-2 rounded-lg border-GOLD-4 p-4">
						Win My Lane
					</h1>
					<div className="relative">
						<input
							className="block mx-auto w-80 sm:w-[32rem] max-w-lg bg-gradient-to-b from-BLUE-7 to-BLUE-6 border-GOLD-4 text-GOLD-1 pl-2 border-2 rounded-lg"
							onChange={(e) => {
								setQuery(e.currentTarget.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									queryData(
										championNames.filter((name) => {
											return query.toLowerCase() === ""
												? false
												: name.commonName.toLowerCase().startsWith(query.toLowerCase());
										})[0].dataName
									);
									setQuery("");
									e.currentTarget.value = "";
								}
							}}
							placeholder="Enter Champion Name:"
						/>
						<div className="autosuggest mx-auto w-80 sm:w-[160rem] max-w-lg absolute top-full">
							{championNames
								.filter((name) => {
									return query.toLowerCase() === ""
										? false
										: name.commonName.toLowerCase().startsWith(query.toLowerCase());
								})
								.map((name, index) => (
									//TODO: make into components
									<div
										className="champ-tile hover:scale-110 focus:scale-110 transition-all bg-gradient-to-b from-BLUE-7 to-BLUE-6"
										key={index}
										tabIndex={0}
										onClick={() => {
											queryData(name.dataName);
											setQuery("");
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												queryData(name.dataName);
												setQuery("");
											}
										}}
									>
										<img
											className="inline border border-GOLD-4"
											src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${name.dataName}.png`}
											alt={`${name.commonName} icon`}
											width="30"
											height="30"
										/>
										<span className="pl-2 text-GOLD-1">
											{name.commonName}
											<br />
										</span>
									</div>
								))}
						</div>
					</div>

					{tips && (
						<div className="text-GOLD-1 mt-16 bg-gradient-to-b from-BLUE-7 to-BLUE-6 border-2 rounded-lg border-GOLD-4 p-4">
							<img
								className="block border border-GOLD-4 text-center mx-auto animate-in mb-4"
								src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${activeChamp}.png`}
								alt={`${activeChamp} icon`}
								key={`${activeChamp} icon`}
								width="60"
								height="60"
							/>
							{tips.map((tip) => (
								<p key={tip} className="text-xl text-center animate-in mb-4">
									"{tip}"
								</p>
							))}
							{tips.length === 0 && (
								<p key={activeChamp} className="text-center animate-in text-xl mb-4">
									I've got nothin'. Just get good I guess.
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
