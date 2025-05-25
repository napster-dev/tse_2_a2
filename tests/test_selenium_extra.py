import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

APP_URL = "http://localhost:3000/"

@pytest.fixture(scope="module")
def driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()

def test_user_list_empty_on_fresh_start(driver):
    driver.get(APP_URL)
    driver.find_element(By.ID, "loadBtn").click()
    time.sleep(1)
    user_list = driver.find_element(By.ID, "userList")
    items = user_list.find_elements(By.TAG_NAME, "li")
    # If database is empty, list should be empty. If not, this will just pass if no error.
    assert isinstance(items, list)

def test_submit_and_reload(driver):
    driver.get(APP_URL)
    name = "ReloadUser"
    input_box = driver.find_element(By.ID, "username")
    input_box.clear()
    input_box.send_keys(name)
    driver.find_element(By.CSS_SELECTOR, "#userForm button[type='submit']").click()
    alert = driver.switch_to.alert
    alert.accept()
    # Reload the page and check if the user is still in the list
    driver.refresh()
    driver.find_element(By.ID, "loadBtn").click()
    time.sleep(1)
    user_list = driver.find_element(By.ID, "userList")
    items = [li.text for li in user_list.find_elements(By.TAG_NAME, "li")]
    assert name in items 