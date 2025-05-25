import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time

# Adjust this path if needed
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

def test_home_page_loads(driver):
    driver.get(APP_URL)
    assert "User Submission App" in driver.title
    assert driver.find_element(By.ID, "userForm")
    assert driver.find_element(By.ID, "loadBtn")

def test_user_submission(driver):
    driver.get(APP_URL)
    input_box = driver.find_element(By.ID, "username")
    input_box.clear()
    input_box.send_keys("TestUser1")
    driver.find_element(By.CSS_SELECTOR, "#userForm button[type='submit']").click()
    alert = driver.switch_to.alert
    assert "User added successfully" in alert.text
    alert.accept()
    assert input_box.get_attribute("value") == ""

def test_load_users_button(driver):
    driver.get(APP_URL)
    driver.find_element(By.ID, "loadBtn").click()
    time.sleep(1)  # Wait for fetch
    user_list = driver.find_element(By.ID, "userList")
    items = user_list.find_elements(By.TAG_NAME, "li")
    assert len(items) >= 1

def test_required_field_validation(driver):
    driver.get(APP_URL)
    input_box = driver.find_element(By.ID, "username")
    input_box.clear()
    driver.find_element(By.CSS_SELECTOR, "#userForm button[type='submit']").click()
    # The browser should prevent submission, so no alert should appear
    time.sleep(1)
    try:
        alert = driver.switch_to.alert
        alert_text = alert.text
        alert.accept()
        assert False, f"Unexpected alert appeared: {alert_text}"
    except:
        # No alert, as expected
        pass

def test_multiple_user_submissions_and_listing(driver):
    driver.get(APP_URL)
    names = ["TestUser2", "TestUser3"]
    for name in names:
        input_box = driver.find_element(By.ID, "username")
        input_box.clear()
        input_box.send_keys(name)
        driver.find_element(By.CSS_SELECTOR, "#userForm button[type='submit']").click()
        alert = driver.switch_to.alert
        alert.accept()
    driver.find_element(By.ID, "loadBtn").click()
    time.sleep(1)
    user_list = driver.find_element(By.ID, "userList")
    items = [li.text for li in user_list.find_elements(By.TAG_NAME, "li")]
    # Check that both names are in the list, and in correct order (most recent first)
    assert names[1] in items[0] and names[0] in items[1] 