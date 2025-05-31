import contractABI from './Server app/api/abi/VotingFactory.json'; // Import ABI from JSON

const { ethers } = require('ethers');

// Провайдер для MetaMask
const provider = new ethers.Web3Provider(window.ethereum, "any"); // Web3 provider for MetaMask

// Запрашиваем доступ к аккаунту MetaMask
async function requestAccount() {
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}

// Создаем экземпляр контракта с использованием провайдера MetaMask
async function getContract() {
  const account = await requestAccount();
  const contractAddress = FACTORY_ADDRESS; // Адрес твоего контракта
  const signer = provider.getSigner(account); // Получаем signer из MetaMask
  return new ethers.Contract(contractAddress, contractABI, signer);
}

// Пример функции для создания опроса через MetaMask
async function createPoll(description, options, duration) {
  const contract = await getContract();
  try {
    const tx = await contract.createPoll(description, options, duration);
    await tx.wait(); // Ожидаем завершения транзакции
    console.log(`Poll created with ID: ${tx.hash}`);
  } catch (error) {
    console.error("Error creating poll:", error);
  }
}

// Пример функции для голосования через MetaMask
async function vote(pollId, option) {
  const contract = await getContract();
  try {
    const tx = await contract.vote(pollId, option);
    await tx.wait(); // Ожидаем завершения транзакции
    console.log(`Vote casted for poll ID: ${pollId}`);
  } catch (error) {
    console.error("Error voting:", error);
  }
}
